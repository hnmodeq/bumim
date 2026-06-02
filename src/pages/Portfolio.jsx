import PortfolioSection from "@/sections/Portfolio";


const grid =`

grid
grid-cols-1
`

const Portfolio = () => {
    return (
        <main className={grid}>
            <PortfolioSection
                titleText="نمونه کارها"
                descriptionText="بخشی از نمونه‌کارهای ما برای آشنایی بیشتر با سبک روایت، ریتم و نگاه ما به محتوای دیجیتال."
                showFilters={true}
                showMoreLink={false}
            />
        </main>
    );
};

export default Portfolio;
