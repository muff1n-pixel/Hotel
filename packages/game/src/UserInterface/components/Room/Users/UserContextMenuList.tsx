import { ReactNode } from "react";

export type UserContextMenuListProps = {
    children: ReactNode | ReactNode[];
};

export default function UserContextMenuList({ children }: UserContextMenuListProps) {
    /*const mappedChildren = (Array.isArray(children))?(children):([children]);
    
    return mappedChildren.filter(Boolean).map((child, index, array) => (
        (index === array.length - 1)?(
            child
        ):(
            <Fragment>
                {child}

                <div style={{
                    height: 1,
                    backgroundColor: "#4F4C48"
                }}/>
            </Fragment>
        )
    ));*/

    return children;
}
