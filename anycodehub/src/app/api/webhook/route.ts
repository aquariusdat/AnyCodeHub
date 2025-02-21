import { createUser } from "@/lib/actions/user.actions";
import { EUserRole, EUserStatus } from "@/types/enums";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

// const webhookSecret: string = process.env.WEBHOOK_SECRET || "whsec_uR0gzc7iMzuH3zQrqNw3fGGBmPBXcNRS";

export async function POST(req: Request) {
    if (!process.env.WEBHOOK_SECRET) throw new Error(`Webhook secret is not defined`);

    const webhookSecret: string = process.env.WEBHOOK_SECRET;

    const svix_id = req.headers.get("svix-id") ?? "";
    const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
    const svix_signature = req.headers.get("svix-signature") ?? "";

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const sivx = new Webhook(webhookSecret);

    let msg: WebhookEvent;

    try {
        msg = sivx.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        return new Response(`Bad Request ${err}`, { status: 400 });
    }

    const eventType = msg.type;
    console.log(msg);
    switch (eventType) {
        case 'user.created':
            console.log(`User created: ${msg.data}`);
            createUser({
                clerkId: msg.data.id,
                emailAddress: msg.data.email_addresses[0].email_address,
                userName: msg.data.email_addresses[0].email_address,
                avatar: msg.data.image_url,
                status: EUserStatus.ACTIVE,
                role: msg.data.email_addresses[0].email_address === 'tondat.dev' ? EUserRole.ADMIN : EUserRole.GUEST
            });
            break;
        case 'user.updated':
            console.log(`User updated: ${msg.data}`);
            break;
        case 'user.deleted':
            console.log(`User deleted: ${msg.data}`);
            break;
    }

    // Rest

    return new Response("OK", { status: 200 });
}