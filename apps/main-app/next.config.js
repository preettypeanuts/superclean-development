const { withNx } = require('@nx/next');

module.exports = withNx({
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: `http://localhost:3001/:path*`
      }
    ];
  },
});
