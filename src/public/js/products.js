
$(function (){
  
    $("#searchButton").on("click", async function(e) {
        e.preventDefault()
        const searchValue = $('#searchInput').val().trim();
        try {
            const response = await axios.get(`/admin/product/all?search=${searchValue}&page=1&limit=10`)
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            $('.table').html($(doc).find('.table').html());
            $('#pagination').html($(doc).find('#pagination').html());
        } catch (err) {
        }
    
    });

 const handleCategoryButtonClick = async (collection) => {
    try {
        const response = await axios.get(`/admin/product/all?productCollection=${collection}&page=1&limit=10`);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');

        $('.table').html($(doc).find('.table').html());
        $('#pagination').html($(doc).find('#pagination').html());
    } catch (error) {
    }
};

// Event listeners for category buttons
$("#pizza-btn").on("click", () => handleCategoryButtonClick('PIZZA'));
$("#pasta-btn").on("click", () => handleCategoryButtonClick('PASTA'));
$("#salad-btn").on("click", () => handleCategoryButtonClick('SALAD'));
$("#appetizers-btn").on("click", () => handleCategoryButtonClick('APPETIZERS'));
$("#drink-btn").on("click", () => handleCategoryButtonClick('DRINK'));

    $(document).ready(function() {
    async function loadPage(page) {
        try {
            const response = await axios.get(`/admin/product/all?page=${page}`); // Update this URL to match your server endpoint
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            // Assuming response contains the HTML for #product-data and #pagination
            $('.table').html($(doc).find('.table').html());
            $('#pagination').html($(doc).find('#pagination').html());
        } catch (error) {
            console.error('Failed to load content.', error);
        }
    }

    $(document).on('click', '.pagination a', async function(e) {
        e.preventDefault()
        const page = $(this).attr('href').split('page=')[1];
        await loadPage(page);
    });

});

   
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if(selectedValue === 'DRINK') {
           $('#product-volume').show();
           $('#product-collection').hide();
        }else {
            $('#product-volume').hide();
            $('#product-collection').show();
        }
    })

    $('#process-btn').on("click", () => {
        $('.dish-container').slideToggle(500);
        $('#process-btn').css('display', "none")
    })

    $('#cancel-btn').on("click", () => {
        $('.dish-container').slideToggle(100);
        $('#process-btn').css('display', "flex")
    })

    $(".new-product-status").on("change", async function(e) {
        const id = e.target.id;
        const productStatus = $(`#${id}.new-product-status`).val();

        try {
            const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus})
            const result = response.data;

            if(result.data) {
                $(".new-product-status").blur();
            }else {
                alert("product update is failed!")
            }
        } catch (err) {
            alert('Product update failed!')
        }
    })
    $(".new-product-available-status").on("change", async function(e) {
        const id = e.target.id;
        const productAvailable = $(`#${id}.new-product-available-status`).val();

        try {
            const response = await axios.post(`/admin/product/${id}`, {productAvailable: productAvailable})
            const result = response.data;

            if(result.data) {
                $(".new-product-available-status").blur();
            }else {
                alert("product update is failed!")
            }
        } catch (err) {
            alert('Product update failed!')
        }
    })






})


function validateForm(){
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCollection = $(".product-collection").val();
    const productIngridients = $(".product-ingr").val();
    const productDesc = $(".product-desc").val();
    const productStatus = $(".product-status").val();
 
    if(
        productName === "" ||
        productPrice === "" ||
        productLeftCount === "" ||
        productCollection === "" ||
        productDesc === "" ||
        productStatus === "" ||
        productIngridients === "" 
    ){
     alert("Please insert all required inputs");
     return false
    }else {
        return true
    }
 
 }

 function previewFileHandler(input, order) {
    const imgClassName = input.className;
    const file = $(`.${imgClassName}`).get(0).files[0];
    const fileType = file['type'];
    const validImageType = ['image/jpg', 'image/jpeg', 'image/png'];
    if(!validImageType.includes(fileType)){
        alert('Please insert only jpeg, jpg, and png!');
    }else {
        if(file) {
            const reader = new FileReader();
            reader.onload = function() {
                $(`#image-section-${order}`).attr('src', reader.result)
            };
            reader.readAsDataURL(file)
        }
    }
 }

