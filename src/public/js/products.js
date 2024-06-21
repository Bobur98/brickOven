
$(function (){
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
            console.log("Error productStatus:", err);
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
            console.log("Error productStatus:", err);
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
    console.log("input:", input);
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



 /**************Filter***********/ 
  $(document).ready(function() {
      $('.btn-wrapper button').on('click', function() {
        const category = $(this).data('category');
        fetchData({ productCollection: category });
      });

      $('#searchInput').on('keyup', function(event) {
        if (event.key === 'Enter') {
          const query = $(this).val();
          fetchData({ query });
        }
      });

      function fetchData(params) {
        const queryString = $.param(params);
        console.log(queryString,'9999');
        $.ajax({
          url: `/admin/product/all/?${queryString}`,
          method: 'GET',
          success: function(data) {
            return data
          },
          error: function(error) {
            console.error('Error fetching data:', error);
          }
        });
      }


    });