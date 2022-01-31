import BottomNav from './BottomNav';

const Layout = ({children}) => {
    return (
        <>
            <div className=""
                style={{
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                    backgroundImage: "url(./bg.svg)",
                    backgroundSize: "cover",
                    backgroundColor: "#111111"
                }}
            >
                <main className="">
                    {children}
                </main>
                <BottomNav/>
            </div>
        </>
    )
}

export default Layout