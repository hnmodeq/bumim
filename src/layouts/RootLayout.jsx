import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import ScrollToTop from "@/utilities/ScrollToTop";
import LoadingScreen from "@/sections/LoadingScreen";
import ParallaxBackground from "@/sections/ParallaxBackground";
// import FloatingOrderButton from "@/sections/FloatingOrderButton";

const layout = `
z-10
flex
flex-col
min-h-screen
relative

md:

lg:

`;

const content = `
flex-1

md:

lg:

`;

const main = `
min-h-[calc(100vh-140px)]

md:

lg:

`;

function RootLayout() {
    return (
        <>
            <ScrollToTop />

            <ParallaxBackground
                gradientSpeed={0.12}
                iconsSpeed={0.28}
            />

            <div className={layout}>
                <Header />

                <div className={content}>
                    <Suspense
                        fallback={
                            <LoadingScreen />
                        }
                    >
                        <main className={main}>
                            <Outlet />
                        </main>
                    </Suspense>
                </div>

                <Footer />
            </div>
            {/* <FloatingOrderButton /> */}
        </>
    );
}

export default RootLayout;
