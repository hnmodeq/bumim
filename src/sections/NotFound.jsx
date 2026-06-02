import { Link } from "react-router-dom";

const container = `
w-full
px-4
py-16
md:px-8
md:py-20
`;

const card = `
mx-auto
max-w-2xl
rounded-[var(--rounded-small)]
border-[var(--border-main)]
bg-[var(--bg-color-primary)]
backdrop-blur-[var(--blur-small)]
shadow-[var(--shadow-small)]
px-6
py-12
text-center

`;

const title = `
text-[length:var(--font-size-med)]
text-[var(--font-color-third)]
`;

const description = `
mt-4
text-[length:var(--font-size-small)]
leading-7
text-[var(--font-color-primary)]
`;

const link = `
inline-flex
mt-8
text-[length:var(--font-size-small)]
text-[var(--font-color-secondary)]
transition-colors
duration-200
hover:text-[var(--font-color-third)]
`;

const NotFound = () => {
    return (
        <main className={container}>
            <div className={card}>
                <h1 className={title}>صفحه مورد نظر یافت نشد!</h1>
                <p className={description}>
                    ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه حذف شده باشد.
                </p>
                <Link to="/" className={link}>
                    بازگشت به صفحه اصلی
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
