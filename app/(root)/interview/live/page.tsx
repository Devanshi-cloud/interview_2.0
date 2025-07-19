// app/interview/live/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Utility function to generate unique ID
function generateUniqueId(length = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

interface SharedLink {
  name: string;
  url: string;
}

export default function LiveInterviewPage() {
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [isZegoLoaded, setIsZegoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const userId = useRef(generateUniqueId(8));
  const zegoModuleRef = useRef<any>(null);
  
  // Safe function to get URL parameters
  const getUrlParams = () => {
    if (typeof window === 'undefined') return new URLSearchParams('');
    const urlStr = window.location.href.split('?')[1];
    return new URLSearchParams(urlStr || '');
  };

  // Load Zego module on client side
  useEffect(() => {
    setMounted(true);
    
    // Dynamically import ZegoUIKitPrebuilt
    const loadZegoModule = async () => {
      try {
        const module = await import('@zegocloud/zego-uikit-prebuilt');
        zegoModuleRef.current = module.ZegoUIKitPrebuilt;
        setIsZegoLoaded(true);
      } catch (error) {
        console.error("Failed to load Zego module:", error);
      }
    };
    
    loadZegoModule();
  }, []);

  const handleStartMeeting = () => {
    if (!isZegoLoaded) {
      alert("Live streaming service is still loading. Please try again in a moment.");
      return;
    }
    
    setShowNameInput(false);
    setTimeout(() => {
      if (containerRef.current) {
        startMeeting(containerRef.current);
      }
    }, 100);
  };

  const startMeeting = (element: HTMLDivElement) => {
    if (!zegoModuleRef.current || !mounted) return;
    
    const ZegoUIKitPrebuilt = zegoModuleRef.current;
    
    // Get room parameters
    const params = getUrlParams();
    const roomID = params.get('roomID') || generateUniqueId(6);
    let role_str = params.get('role') || 'Host';
    const role =
      role_str === 'Host'
        ? ZegoUIKitPrebuilt.Host
        : role_str === 'Cohost'
        ? ZegoUIKitPrebuilt.Cohost
        : ZegoUIKitPrebuilt.Audience;

    // Configure shared links for inviting others
    const sharedLinks: SharedLink[] = [];
    if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
      sharedLinks.push({
        name: 'Join as co-host',
        url:
          window.location.protocol + '//' + 
          window.location.host + window.location.pathname +
          '?roomID=' +
          roomID +
          '&role=Cohost',
      });
    }
    sharedLinks.push({
      name: 'Join as audience',
      url:
      window.location.protocol + '//' + 
      window.location.host + window.location.pathname +
        '?roomID=' +
        roomID +
        '&role=Audience',
    });
    
    const appID = parseInt(process.env.NEXT_PUBLIC_ZEGOCLOUD_APPID || '1702549576');
    const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET || '519aaba11b80375f80d8593a86398780';
    const displayName = userName || `User-${userId.current.substring(0, 4)}`;
    
    // Generate Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomID,
      userId.current,
      displayName
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
    // Start the call
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role,
        },
      },
      sharedLinks,
    });
  };

  // Get room parameters for display on the join screen
  const params = mounted ? getUrlParams() : new URLSearchParams('');
  const roomID = params.get('roomID') || generateUniqueId(6);
  const role_str = params.get('role') || 'Host';

  if (!mounted) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 bg-slate-900">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/robot.png" alt="Interview AI" width={40} height={40} />
          <span className="font-bold text-white">Interview AI</span>
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/" className="text-white">Exit Interview</Link>
        </Button>
      </div>
      
      {showNameInput ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <h1 className="text-2xl font-bold">Join Live Interview</h1>
          <p>Room ID: {roomID}</p>
          <p>Your Role: {role_str}</p>
          
          <div className="flex flex-col w-full max-w-md gap-2">
            <label htmlFor="userName" className="text-sm font-medium">
              Display Name
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="px-3 py-2 border rounded-md"
            />
          </div>
          
          <Button 
            onClick={handleStartMeeting}
            className="bg-blue-600 hover:bg-blue-700 text-white max-w-md w-full"
            disabled={!isZegoLoaded}
          >
            {isZegoLoaded ? "Join Meeting" : "Loading..."}
          </Button>
        </div>
      ) : (
        <div className="flex-1 bg-black" ref={containerRef}></div>
      )}
    </div>
  );
}