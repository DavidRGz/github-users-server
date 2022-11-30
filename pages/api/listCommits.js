import { Octokit } from '@octokit/core';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default async (req, res) => {
  try {
    const owner = req.query.owner;
    const repo = req.query.repo;
    const page = req.query.page || 1;
    const per_page = req.query.per_page || 10;
    const response = await octokit.request(
      `GET /repos/${owner}/${repo}/commits?page=${page}&per_page=${per_page}`,
      {
        headers: {
          accept: 'application/vnd.github+json',
        },
      }
    );
    res.json({
      data: response.data.map((commit) => ({
        sha: commit.sha,
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
        message: commit.commit.message,
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
