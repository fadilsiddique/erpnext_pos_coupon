
$(window).on('load', page_changed);

function page_changed(event) {


    

    frappe.after_ajax(function () {
        var route = frappe.get_route();
        if (route[0] == "pos") {
            var button_off = document.createElement('button');
            button_off.style.color = "white";
            button_off.innerHTML = 'Add Couponsss';
            let container = document.querySelector('div.col-sm-12');
            container.appendChild(button_off).style.backgroundColor = "#5e64ff";
            button_off.onclick = function () {
                d.show();
            }
        } else if (route[0] == "point-of-sale")


        {

            

            //Selectors


            //Add coupon button to pos 
            var button_off = document.createElement('button');
            button_off.style.color = "white";
            button_off.innerHTML = 'Add Coupon';
            let container = document.querySelector('.clearfix');
            //container.innerHTML  = container.innerHTML + "<br/>" ;
            container.appendChild(button_off).style.backgroundColor = "#5e64ff";
            button_off.onclick = function () {
                d.show();
            }

	
            
        
            var button_order = document.createElement('button');
            button_order.innerHTML = 'Show/Hide Order';
            button_order.classList.add('show_order');

            
            button_order.onclick = function () {
                
            
            $(".pos-cart").fadeToggle("3000");
            

                
            }


            var button_bar = document.createElement("DIV");
            
            button_bar.appendChild(button_order);
            button_bar.classList.add("button-bar");

            let pos = $('.pos');
            
            if($('.button-bar').length == 0){
                pos.prepend(button_bar);                
            }
           
            

            

            
            /*var input = document.createElement('input');
            input.setAttribute("type", "text");
            input.setAttribute("value", "Total");
            console.log("okkkk")
            input.innerHTML = 'Total Amount';
            input.classList.add("col-8");*/

            net_total_text = document.querySelector('div.net-total').textContent // extracting net total value
            net_total_int = net_total_text.match(/\d+/)[0] //extracting integer values from net-total array as string
            net_total = parseInt(net_total_int) // converting string to integer

            var totalElm = document.createElement('DIV');
            //totalElm.innerHTML = net_total ;
            totalElm.classList.add('col-8')
            
            var button_pay = document.createElement('button');
            button_pay.innerHTML = 'Pay';

            button_pay.classList.add("col-4");
            let pos_pay = $('div.num-col.brand-primary');
            button_pay.onclick = function () {

                $('div.num-col.brand-primary').click();
                console.log('paid');   

            }

            
            var bottom_toolbar = document.createElement("DIV");
            bottom_toolbar.appendChild(totalElm)
            bottom_toolbar.appendChild(button_pay)
            
           
            bottom_toolbar.classList.add("fixed-bottom");
            bottom_toolbar.classList.add("row");
            bottom_toolbar.classList.add("col-12");

            pos.append(bottom_toolbar);

            let itemSelect = document.querySelector('.pos-items-wrapper');
            let totalAmount = document.querySelector('.net-total');
            let mposAmount = document.querySelector('.col-8');
            let roundTotal = document.querySelector('.rounded-total-value')



            myfunction = function() {

                mposAmount.innerText = totalAmount.textContent;
                }

            itemSelect.onclick = function(){
                myfunction();
            }

            

           




        }
        
    })
}



let d = new frappe.ui.Dialog({
    title: 'Enter details',
    fields: [{
            label: 'Coupon Code',
            fieldname: 'coupon_code',
            fieldtype: 'Data'
        }

    ],
    primary_action_label: 'Apply',
    primary_action(val) {

        net_total_text = document.querySelector('div.net-total').textContent // extracting net total value
        net_total_int = net_total_text.match(/\d+/)[0] //extracting integer values from net-total array as string
        net_total = parseInt(net_total_int) // converting string to integer
        qty_totaltext = document.querySelector('div.quantity-total').innerText
        qty_total_int = qty_totaltext.match(/\d+/)[0]
        qty_total = parseInt(qty_total_int);

        let cart_items = {}

        for(i of cur_frm.doc.items){
            cart_items[i.item_code] = i.qty 

        }

        console.log(cart_items);
        
           

        frappe.call({
            method: "erpnext_pos_coupon.codex.get_value",
            args: {
                "field_name": val.coupon_code,
                net_total: net_total,
                qty_total: qty_total,
                cart_items: cart_items

            },
            callback: function (r) {
                var k = JSON.parse(r.message)
                if (k.coupon_type == "Gift Card") {
                    var customer_ = document.querySelector("input[data-fieldname='customer']");
                    if (customer_.value != k.customer) {
                        frappe.throw("You do not have this Offer")
                        return false
                    }
                }
                if (k.discount_type == "Amount") {
                    var discount = document.querySelector('input.discount_amount');
                    discount.value = k.discount_value
                } else if (k.discount_type == "Percentage") {
                    var discount = document.querySelector('input.additional_discount_percentage');
                    discount.value = k.discount_value
                }
                discount.dispatchEvent(new Event('change'));
            }
        });
        d.hide();
    }
});