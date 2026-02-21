import { useEffect } from "react";
import Loading from "./Loading";

export default function Welcome() {
    useEffect(() => {
        window.location.href = 'https://swissborg.com/fr/r/WASB15';
    }, [])

    return (
        <Loading />
    )
}