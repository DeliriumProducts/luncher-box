const assert = require('assert');
const net = require('net');

assert(process.env.REDIS_PASSWORD, 'REDIS_PASSWORD is required for this test');

const Redis = require('ioredis');
const { redisConfig } = require('../src/config/redis');
const { io, server } = require('../src/config/socket.io');
const timeout = setTimeout(() => {
  console.error('Redis authentication test timed out');
  process.exit(1);
}, 15000);

(async () => {
  assert.equal(redisConfig.password, process.env.REDIS_PASSWORD);
  await new Promise((resolve, reject) => {
    const socket = net.createConnection(redisConfig.port, redisConfig.host);
    socket.on('error', reject);
    socket.on('connect', () => socket.write('*1\r\n$4\r\nPING\r\n'));
    socket.once('data', data => {
      socket.destroy();
      try {
        assert(data.toString().startsWith('-NOAUTH'), 'Anonymous Redis access must be denied');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });

  const client = new Redis(redisConfig);
  assert.equal(await client.ping(), 'PONG');
  const adapter = io.of('/').adapter;
  await new Promise((resolve, reject) => {
    adapter.pubClient.ping((error, reply) => {
      if (error) return reject(error);
      assert.equal(reply, 'PONG');
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    adapter.subClient.subscribe('security:auth-test', error => {
      if (error) return reject(error);
      adapter.subClient.once('message', (channel, message) => {
        assert.equal(channel, 'security:auth-test');
        assert.equal(message, 'verified');
        resolve();
      });
      adapter.pubClient.publish('security:auth-test', 'verified');
    });
  });

  console.log(`PASS: Node ${process.version}, anonymous access denied, authenticated ioredis and Socket.IO pub/sub`);
  client.disconnect();
  adapter.pubClient.quit();
  adapter.subClient.quit();
  io.close();
  server.close();
  clearTimeout(timeout);
  process.exit(0);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
