import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const username = req.query.username;
    const page = req.query.page || 1;
    const per_page = req.query.per_page || 10;
    const response = await octokit.request(
      `GET /users/${username}/repos?page=${page}&per_page=${per_page}`,
      {
        headers: {
          accept: 'application/vnd.github+json',
        },
      }
    );
    res.json({
      data: response.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        owner: repo.owner.login,
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
