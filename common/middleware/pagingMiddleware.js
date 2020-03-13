import should from 'should';

export default (defaultPerPage = 10, sortTargets = []) => {

    defaultPerPage.should.be.instanceOf(Number);
    sortTargets.should.be.instanceOf(Array);
    sortTargets.forEach(e => e.should.be.instanceOf(String));

    return (req, res, next) => {
        try {
            let { perPage = defaultPerPage, page = 1, sort } = req.query;

            perPage = parseInt(perPage);
            perPage.should.be.instanceOf(Number).and.above(0);

            page = parseInt(page);
            page.should.be.instanceOf(Number).and.above(0);

            let sortArray = [];
            if(sortTargets.length > 0 && sort !== undefined) {
                sort = sort.trim();
                console.log(sort);
                sortArray = sort.split(",").map(e => {
                    const parsed = e.split(" ");
                    parsed.length.should.be.equal(2);

                    const key = parsed[0];
                    const value = parsed[1].toLowerCase();

                    key.should.be.oneOf(sortTargets);
                    value.should.be.oneOf('asc', 'desc');
    
                    return { key, value };
                });
            }

            req.paging = {
                perPage,
                page,
                sort: sortArray,
                sortTargets,
                offset: (page - 1) * perPage,
                limit: perPage,
            }

            next();
        } catch (err) {
            console.log(err.stack);
            return res.status(400).send('Paging Exception');
        }
    }
}