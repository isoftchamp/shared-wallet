interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, callback: (data: any) => void) => void;
    removeListener: (event: string, callback: (data: any) => void) => void;
    isMetaMask?: boolean;
  };
}
