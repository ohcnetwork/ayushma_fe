import { useState, useEffect } from "react";
import { Button } from "./ui/interactive";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="fixed bottom-4 right-4">
            {isVisible && (
                <Button
                    className="inline-block p-3 text-black font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-gray-400 hover:shadow-lg focus:bg-gray-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5 bg-gray-200 h-10 w-10"
                    onClick={scrollToTop}
                >
                    <i className="fas fa-chevron-up"></i>
                </Button>
            )}
        </div>
    );
};

export default ScrollToTop;
