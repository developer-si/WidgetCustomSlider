import { ReactElement, createElement } from "react";

export interface HelloWorldSampleProps {
    valueAttribute?: number;
}

export function HelloWorldSample({  }: HelloWorldSampleProps): ReactElement {
    return <div className="widget-hello-world">Hello </div>;
}
