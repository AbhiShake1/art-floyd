const { withAxiom } = await import('next-axiom');

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: 'aceternity.com',
			},
		],
	},
};

export default withAxiom(config);
