// Fix for vfd_providers/utils/customer.js
// Replace entire file with this version

frappe.ui.form.on("Customer", {
    refresh: function(frm) {
        check_vfd_territory(frm);
    },

    territory: function(frm) {
        check_vfd_territory(frm);
    },

    vfd_cust_id_type: function(frm) {
        if (!frm._is_vfd_customer) return;

        if (frm.doc.vfd_cust_id_type === "1- TIN" && frm.doc.tax_id) {
            frm.set_value("vfd_cust_id", frm.doc.tax_id.replace(/-/g, ""));
        }
    },

    vfd_cust_id: function(frm) {
        if (!frm._is_vfd_customer) return;

        if (frm.doc.vfd_cust_id_type && frm.doc.vfd_cust_id_type.startsWith("1")) {
            let cleaned = (frm.doc.vfd_cust_id || "").replace(/\D/g, "");
            if (cleaned.length !== 9) {
                frappe.msgprint({
                    title: __("TIN Validation"),
                    indicator: "orange",
                    message: __("Tanzania TIN should be 9 digits. Current: {0}", [cleaned.length])
                });
            }
        }
    },

    tax_id: function(frm) {
        if (!frm._is_vfd_customer) return;

        let cleaned = (frm.doc.tax_id || "").replace(/\D/g, "");
        if (cleaned && cleaned.length !== 9) {
            frappe.msgprint({
                title: __("TIN Validation"),
                indicator: "orange",
                message: __("Tanzania TIN should be 9 digits. Current: {0}", [cleaned.length])
            });
            return;
        }

        if (cleaned) {
            frm.set_value("vfd_cust_id", cleaned);
            frm.set_value("vfd_cust_id_type", "1- TIN");
        }
    },
});


function check_vfd_territory(frm) {
    let territory = frm.doc.territory;

    if (!territory) {
        frm._is_vfd_customer = false;
        frm.toggle_display("vfd_details", false);
        return;
    }

    if (territory === "Tanzania") {
        frm._is_vfd_customer = true;
        frm.toggle_display("vfd_details", true);
        return;
    }

    // Check if parent is Tanzania
    frappe.db.get_value("Territory", territory, "parent_territory", (r) => {
        frm._is_vfd_customer = r && r.parent_territory === "Tanzania";
        frm.toggle_display("vfd_details", frm._is_vfd_customer);
    });
}