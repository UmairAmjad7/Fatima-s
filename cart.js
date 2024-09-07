$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:3000/cartData',
        type: 'GET',
        dataType: 'json', 
        success: function (data) {
           const cartData = data.cartDetails;
           $('#cartid').text(cartData[0].cartid);
           displayCart(cartData);
           function displayCart(cartDetails){
             let totalPrice = 0; 
             $.each(cartDetails, function (index, item) { 
                 $('#prods').append(`<table class="table table-bordered table-hover">
                 <thead>
                     <tr>
                         <th>Category Name</th>
                         <th>Product Id</th>
                         <th>Product Name</th>
                         <th>Product Colour</th>
                         <th>Price</th>
                     </tr>
                 </thead>
                 <tbody id="parkingDetailsBody">
                     <tr class="text-black">
                         <td>${item.categoryname}</td> 
                         <td>${item.productid}</td>
                         <td>${item.name}</td>
                         <td>${item.colour}</td>
                         <td>${item.price}</td>
                     </tr>
                 </tbody>
             </table>`);
             totalPrice += item.price; // Add each item's price to total price
             });
             totalTable(totalPrice); // Call totalTable with total price
           }
           function totalTable(totalPrice){
                $('#prods').append(`<table class="table table-bordered table-hover">
                    <tbody>
                        <tr>
                            <td class="fw-bold">Total</td>
                            <td>${totalPrice}</td>
                        </tr>
                    </tbody>
                </table>`);
           }
        },
        error: function (error) {
            alert('An error occurred while getting the data');
            console.error(error);
        }
    });
});
