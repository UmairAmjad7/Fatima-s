$(document).ready(function () {
  
    $('.buy-btn').click(function (event) {
        event.preventDefault();

        var productId = $(this).data('product-id');

        $.ajax({
            url: 'http://localhost:3000/submitProducts',
            type: 'POST',
            data: { productId: productId },
            success: function (response) {
                alert('Item added successfully');
            },
            error: function (error) {
                alert('An error occurred while submitting the form.');
                console.error(error);
            }
        });
    });
});
