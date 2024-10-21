import { FastifyInstance } from "fastify";

import svgCaptcha from 'svg-captcha';

export default async function baseRoutes(fastify: FastifyInstance) {
    // 获取比赛的题目列表
    fastify.get<{ Params: { id: number } }>('/captcha', async (request, reply) => {
        const captcha = svgCaptcha.create({
            ignoreChars: '0o1il',
            color: true,
            noise: 4
        });
        request.axSession.set('captcha', captcha.text);
        reply.type('image/svg+xml');
        return reply.send(captcha.data);
    });
}