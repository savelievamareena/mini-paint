import { lazy, Suspense } from "react";
import { Loading } from "../components/Loading";
const Paint = lazy(() => import("../modules/Paint"));

const PaintPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Paint />
        </Suspense>
    );
};

export default PaintPage;
