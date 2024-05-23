/** @type {import('next').NextConfig} */
const nextConfig = {
  // …
  experimental: {
    // …
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  async headers() {
    return [
        {
            source: "/",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "https://firebasestorage.googleapis.com/v0/b/ragask-e5821.appspot.com/o/*" }, // replace this your actual origin
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
        }
    ]
}
};
export default nextConfig;
