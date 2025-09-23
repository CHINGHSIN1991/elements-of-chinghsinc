export default function i18n(options = {}) {
  return {
    name: "@astrojs/i18n-local",
    hooks: {
      'astro:config:setup'({ config, updateConfig }) {
        const experimental = config.experimental ?? {};
        updateConfig({
          experimental: {
            ...experimental,
            i18n: {
              ...options
            }
          }
        });
      }
    }
  };
}
