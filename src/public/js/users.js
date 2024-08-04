$(function () {
    // Function to handle member status change
    $(".member-status").on("change", function(e) {
        const id = e.target.id;
        const memberStatus = $(`#${id}.member-status`).val();

        axios.post('/admin/user/edit', {_id: id, memberStatus: memberStatus})
            .then((response) => {
                const result = response.data;
                if (result.data) {
                    $(".member-status").blur();
                } else {
                    alert('User update failed');
                }
            })
            .catch(err => {
                console.error('User update failed:', err);
                alert('User update failed');
            });
    });

    // Function to handle search button click
    $("#searchButton").on("click", async function(e) {
        e.preventDefault();
        const searchValue = $('#searchInput').val().trim();
        try {
            const response = await axios.get(`/admin/user/all?search=${searchValue}&page=1&limit=10`);
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            $('.table').html($(doc).find('.table').html());
            $('#pagination').html($(doc).find('#pagination').html());
        } catch (err) {
            console.error("Error searching users:", err);
            alert('Failed to search users');
        }
    });

    $("#language").on("change", async function(e) {
        e.preventDefault()
        let selectedValue = $(this).val();
        try {
            const response = await axios.get(`/admin/user/all?memberStatus=${selectedValue}&page=1&limit=10`);
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            $('.table').html($(doc).find('.table').html());
            $('#pagination').html($(doc).find('#pagination').html());
        } catch (error) {
            
        }
    })

    

    // Function to handle pagination click
    async function loadPage(page) {
        try {
            const response = await axios.get(`/admin/user/all?page=${page}`);
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            $('.table').html($(doc).find('.table').html());
            $('#pagination').html($(doc).find('#pagination').html());
        } catch (error) {
            console.error('Failed to load content.', error);
        }
    }

    // Event delegation for pagination links
    $(document).on('click', '.pagination a', function(e) {
        e.preventDefault();
        const page = $(this).attr('href').split('page=')[1];
        loadPage(page);
    });
});
