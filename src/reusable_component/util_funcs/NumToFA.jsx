
export default function NumToFA({ num }) {

    return (
        <div className="num-fa">
            {
                num.toString().split("").map((char, i) => {
                    if (char === ".") return <span key={i}>.</span>;
                    return <i key={i} className={`fa-solid fa-${char}`}></i>;
                })
            }
        </div>
    );
}