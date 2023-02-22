export default function Loading(props) {
    const { isLoading } = props;
    let elems;
    if (isLoading) {
        elems = (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>);
    } else {
        elems = props.children;
    }
    return elems;
}
