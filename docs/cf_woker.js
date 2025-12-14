/**
 * Cloudflare Worker for Feishu OAuth Relay
 * 
 * Environment Variables required:
 * - APP_ID
 * - APP_SECRET
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Redirect to Feishu Login
    if (pathname === '/login') {
      const redirectUri = `${url.origin}/callback`;
      // Request permissions for Drive and Docx
      const scope = 'drive:drive docx:document';
      const feishuAuthUrl = `https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=${env.APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
      return Response.redirect(feishuAuthUrl, 302);
    }

    // 2. Callback: Exchange Code for Token
    if (pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      try {
        // Step A: Get App Access Token (Internal)
        const appTokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ app_id: env.APP_ID, app_secret: env.APP_SECRET })
        });
        const appTokenData = await appTokenRes.json();
        if (appTokenData.code !== 0) throw new Error('Failed to get app token: ' + appTokenData.msg);
        const appAccessToken = appTokenData.app_access_token;

        // Step B: Get User Access Token
        const userTokenRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/oidc/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${appAccessToken}`
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code: code
          })
        });

        const userTokenData = await userTokenRes.json();
        if (userTokenData.code && userTokenData.code !== 0) throw new Error(userTokenData.msg || 'Auth Failed');

        // Display Token to User (JSON)
        return new Response(JSON.stringify(userTokenData.data, null, 2), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
      }
    }

    // 3. Refresh Token
    if (pathname === '/refresh') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
      const { refresh_token } = await request.json();

      if (!refresh_token) return new Response('Missing refresh_token', { status: 400 });

      try {
        // Step A: Get App Access Token
        const appTokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ app_id: env.APP_ID, app_secret: env.APP_SECRET })
        });
        const appTokenData = await appTokenRes.json();
        const appAccessToken = appTokenData.app_access_token;

        // Step B: Refresh User Token
        const refreshRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/oidc/refresh_access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${appAccessToken}`
          },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
          })
        });

        const refreshData = await refreshRes.json();

        // Add CORS headers so plugin can call this
        return new Response(JSON.stringify(refreshData.data), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
          }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // Handle OPTIONS for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    return new Response('Feishu OAuth Relay Worker is Running!');
  }
};
