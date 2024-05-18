import {useState} from "react"
import { Logo } from "./Logo";
import {User} from 'lucide-react'

const ROLE = ['user', 'ai'] as const;
type Role = (typeof ROLE)[number];

function ChatMessage({role, message}: {role: Role, message: string}) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                {role === 'user' ? (
                    <span role="img" aria-label="user" style={{ fontSize: '24px' }}><User /></span>
                ) : (
                    <span role="img" aria-label="ai" style={{ fontSize: '24px' }}><Logo/></span>
                )}
            </div>
            <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {role === 'user' ? 'You' : 'AI'}
                </div>
                <div>
                    {message}
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;