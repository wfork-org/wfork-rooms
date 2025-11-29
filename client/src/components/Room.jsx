import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, ScreenShare } from 'lucide-react';

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [peers, setPeers] = useState([]);
    const [userStream, setUserStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [fullscreenId, setFullscreenId] = useState(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [error, setError] = useState(null);

    const socketRef = useRef();
    const userVideoRef = useRef();
    const peersRef = useRef([]); // Array of { peerId, peer, stream }
    const screenTrackRef = useRef(null);
    const userStreamRef = useRef();

    useEffect(() => {
        userStreamRef.current = userStream;
        return () => {
            if (userStreamRef.current) {
                userStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [userStream]);

    useEffect(() => {
        const socketUrl = import.meta.env.PROD ? '/' : 'http://localhost:5000';
        socketRef.current = io.connect(socketUrl);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setUserStream(stream);
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = stream;
                }

                socketRef.current.emit('join-room', roomId);

                socketRef.current.on('all-users', users => {
                    const peers = [];
                    users.forEach(userID => {
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        });
                        peers.push({
                            peerID: userID,
                            stream: null
                        });
                    });
                    setPeers(peers);
                });

                socketRef.current.on('user-joined', payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    });
                    setPeers(users => [...users, { peerID: payload.callerID, stream: null }]);
                });

                socketRef.current.on('receiving-returned-signal', payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    if (item) {
                        item.peer.signal(payload.signal);
                    }
                });

                socketRef.current.on('signal', payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.from);
                    if (item) {
                        item.peer.signal(payload.signal);
                    }
                });

                socketRef.current.on('user-left', id => {
                    const peerObj = peersRef.current.find(p => p.peerID === id);
                    if (peerObj) {
                        peerObj.peer.close();
                    }

                    peersRef.current = peersRef.current.filter(p => p.peerID !== id);
                    setPeers(users => users.filter(p => p.peerID !== id));
                });
            })
            .catch(err => {
                console.error("Error accessing media devices:", err);
                setError("Could not access camera/microphone. Please check permissions.");
            });

        return () => {
            socketRef.current.disconnect();
            peersRef.current.forEach(p => p.peer.close());
        };
    }, [roomId]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = e => {
            if (e.candidate) {
                socketRef.current.emit('send-signal', {
                    to: userToSignal,
                    signal: { type: 'candidate', candidate: e.candidate }
                });
            }
        };

        peer.ontrack = e => {
            setPeers(users => users.map(u => {
                if (u.peerID === userToSignal) {
                    return { ...u, stream: e.streams[0] };
                }
                return u;
            }));
        };

        peer.createOffer().then(offer => {
            peer.setLocalDescription(offer);
            socketRef.current.emit('sending-signal', {
                userToSignal,
                callerID,
                signal: offer
            });
        });

        peer.signal = (incomingSignal) => {
            if (incomingSignal.type === 'candidate') {
                peer.addIceCandidate(new RTCIceCandidate(incomingSignal.candidate)).catch(e => console.error(e));
            } else if (incomingSignal.type === 'answer') {
                peer.setRemoteDescription(new RTCSessionDescription(incomingSignal)).catch(e => console.error(e));
            }
        };

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = e => {
            if (e.candidate) {
                socketRef.current.emit('send-signal', {
                    to: callerID,
                    signal: { type: 'candidate', candidate: e.candidate }
                });
            }
        };

        peer.ontrack = e => {
            setPeers(users => users.map(u => {
                if (u.peerID === callerID) {
                    return { ...u, stream: e.streams[0] };
                }
                return u;
            }));
        };

        peer.setRemoteDescription(new RTCSessionDescription(incomingSignal)).catch(e => console.error(e));

        peer.createAnswer().then(answer => {
            peer.setLocalDescription(answer);
            socketRef.current.emit('returning-signal', {
                signal: answer,
                callerID
            });
        });

        peer.signal = (incomingSignal) => {
            if (incomingSignal.type === 'candidate') {
                peer.addIceCandidate(new RTCIceCandidate(incomingSignal.candidate)).catch(e => console.error(e));
            }
        };

        return peer;
    }

    const toggleMute = () => {
        if (userStream) {
            userStream.getAudioTracks()[0].enabled = !userStream.getAudioTracks()[0].enabled;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (userStream) {
            userStream.getVideoTracks()[0].enabled = !userStream.getVideoTracks()[0].enabled;
            setIsVideoOff(!isVideoOff);
        }
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            screenTrackRef.current = screenTrack;

            // Replace track in peers
            peersRef.current.forEach(peerObj => {
                const sender = peerObj.peer.getSenders().find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(screenTrack);
                }
            });

            // Update local video
            if (userVideoRef.current) {
                userVideoRef.current.srcObject = screenStream;
            }

            setIsScreenSharing(true);

            screenTrack.onended = () => {
                stopScreenShare();
            };

        } catch (err) {
            console.error("Failed to share screen", err);
        }
    };

    const stopScreenShare = () => {
        if (!userStream) return;

        // Revert to camera track
        const videoTrack = userStream.getVideoTracks()[0];

        peersRef.current.forEach(peerObj => {
            const sender = peerObj.peer.getSenders().find(s => s.track.kind === 'video');
            if (sender) {
                sender.replaceTrack(videoTrack);
            }
        });

        if (userVideoRef.current) {
            userVideoRef.current.srcObject = userStream;
        }

        if (screenTrackRef.current) {
            screenTrackRef.current.stop();
            screenTrackRef.current = null;
        }

        setIsScreenSharing(false);
    };

    const toggleScreenShare = () => {
        if (isScreenSharing) {
            stopScreenShare();
        } else {
            startScreenShare();
        }
    };

    const leaveRoom = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        // Stop all tracks
        if (userStream) {
            userStream.getTracks().forEach(track => track.stop());
        }
        if (screenTrackRef.current) {
            screenTrackRef.current.stop();
        }

        navigate('/');
        window.location.reload();
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    const toggleFullscreen = (id) => {
        if (fullscreenId === id) {
            setFullscreenId(null);
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(e => console.error(e));
            }
        } else {
            setFullscreenId(id);
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(e => console.error(e));
            }
        }
    };

    if (error) {
        return <div className="container"><h1>{error}</h1></div>;
    }

    return (
        <div className="container" style={{ justifyContent: 'flex-start' }}>
            <div className="video-grid">
                <div
                    className={`video-container ${fullscreenId === 'me' ? 'fullscreen' : ''}`}
                    onClick={() => toggleFullscreen('me')}
                >
                    <video muted ref={userVideoRef} autoPlay playsInline />
                    <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 4 }}>You</div>
                </div>
                {peers.map((peer) => (
                    <VideoComponent
                        key={peer.peerID}
                        peer={peer}
                        isFullscreen={fullscreenId === peer.peerID}
                        onToggle={() => toggleFullscreen(peer.peerID)}
                    />
                ))}
            </div>
            <div className="controls-bar">
                <button className={`btn-icon ${isMuted ? 'btn-danger' : 'btn'}`} onClick={toggleMute}>
                    {isMuted ? <MicOff /> : <Mic />}
                </button>
                <button className={`btn-icon ${isVideoOff ? 'btn-danger' : 'btn'}`} onClick={toggleVideo}>
                    {isVideoOff ? <VideoOff /> : <Video />}
                </button>
                <button className={`btn-icon ${isScreenSharing ? 'btn-danger' : 'btn'}`} onClick={toggleScreenShare} title="Share Screen">
                    <ScreenShare />
                </button>
                <button className="btn-icon btn-danger" onClick={leaveRoom}>
                    <PhoneOff />
                </button>
                <button className="btn-icon btn" onClick={copyLink} title="Copy Link">
                    <Copy />
                </button>
            </div>
        </div>
    );
};

const VideoComponent = ({ peer, isFullscreen, onToggle }) => {
    const ref = useRef();

    useEffect(() => {
        if (peer.stream) {
            ref.current.srcObject = peer.stream;
        }
    }, [peer.stream]);

    return (
        <div className={`video-container ${isFullscreen ? 'fullscreen' : ''}`} onClick={onToggle}>
            <video playsInline autoPlay ref={ref} />
        </div>
    );
};

export default Room;
