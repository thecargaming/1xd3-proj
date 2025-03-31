import type { Config } from "@react-router/dev/config";

export default {
    appDirectory: "src",
    ssr: true,
    basename: '/~chenp102/team',
    prerender() {
        return [
            '/', '/login'
        ]
    }
} satisfies Config;
