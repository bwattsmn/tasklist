import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Auth>
                <Component {...pageProps} />
            </Auth>
        </SessionProvider>
    );
};

function Auth({ children }: { children?: React.ReactNode }): JSX.Element {
    const { status } = useSession(
        {
            required: true,
            onUnauthenticated: () => { void signIn() }
        }
    );

    if (status === "loading") {
        return (
            <h1>Loading...</h1>
        )
    }

    return <>{children}</>;

}

export default api.withTRPC(MyApp);
