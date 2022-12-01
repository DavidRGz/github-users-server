import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const since = req.query.since || 0;
    const per_page = req.query.per_page || 10;
    const response = await octokit.request(`GET /users?since=${since}&per_page=${per_page}`, {
      headers: {
        accept: 'application/vnd.github+json',
      },
    });
    res.json({
      data: response.data.map((user) => ({
        id: user.id,
        avatar: user.avatar_url,
        username: user.login,
        github: user.html_url,
      })),
      status: response.status,
    });
  } catch (err) {
    res.json({
      status: err.status,
      message: err.message,
    });
  }
};
