declare global {
  interface Window {
    __CSP_NONCE__?: string;
  }
}

export const getCspNonce = (): string | undefined => {
  const metaNonce = document
    .querySelector('meta[name="csp-nonce"]')
    ?.getAttribute("content");

  return metaNonce || window.__CSP_NONCE__;
};

export {};
