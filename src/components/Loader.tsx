interface LoaderProps {
    containerSelector: string
    selector: string
    text?: string
}
export const Loader = ({containerSelector, selector, text = ''}: LoaderProps) => {
    return (
        <div className={containerSelector}>
            <span className={selector}></span>
            <h3>{text}</h3>
        </div>

    )
}
