import { json } from '@sveltejs/kit';
import { stripe } from '$lib/utils/stripe/config';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { supabaseAdmin } from '$lib/utils/supabase/admin.js';

export async function POST({ locals: { safeGetSession } }) {
    try {
        const { user } = await safeGetSession();

        if (!user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the stripe_customer_id from the customers table
        const { data: customerData, error: customerError } = await supabaseAdmin
            .from('customers')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (customerError || !customerData?.stripe_customer_id) {
            return json({ error: 'No customer record found' }, { status: 404 });
        }

        const returnUrl = `${PUBLIC_SITE_URL}/home`;
        
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerData.stripe_customer_id,
            return_url: returnUrl,
        });

        return json({ url: portalSession.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        return json(
            { error: 'Error creating portal session' },
            { status: 500 }
        );
    }
}