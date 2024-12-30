declare module 'user-agent' {
    interface UserAgent {
      os: { name: string };
      device: { name: string };
    }
  
    export function parse(userAgentString: string): UserAgent;
  }
  