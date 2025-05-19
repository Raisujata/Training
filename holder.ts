import { AskarModule } from "@credo-ts/askar";
import { Agent } from "@credo-ts/core";
import { AutoAcceptCredential, BasicMessagesModule, ConnectionsModule, CredentialsModule, getDefaultDidcommModules, HttpOutboundTransport, JsonLdCredentialFormatService, V2CredentialProtocol } from "@credo-ts/didcomm";
import { agentDependencies, HttpInboundTransport } from "@credo-ts/node";
import { askar } from "@openwallet-foundation/askar-nodejs";
import path from "path";

export const holder = new Agent({
    config: {
        label: "Holder",
        walletConfig: {
            id: "holder-wallet",
            key: "Holder123",
        },
    },
    
    modules: {
        ...getDefaultDidcommModules({
            endpoints: ['http://localhost:9002/didcomm'], // Different port for the holder
        }),
        connections: new ConnectionsModule({
            autoAcceptConnections: true,
        }),
        credentials: new CredentialsModule({
            autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
            credentialProtocols: [
                new V2CredentialProtocol({
                    credentialFormats: [new JsonLdCredentialFormatService()],
                }),
            ],
        }),
        basicMessages: new BasicMessagesModule(),
        askar: new AskarModule({
            askar,
        })
    },
    dependencies: agentDependencies
})

holder.modules.didcomm.registerInboundTransport(new HttpInboundTransport({
    port: 9002, // Different port from the issuer
    path: '/didcomm',
}))

holder.modules.didcomm.registerOutboundTransport(new HttpOutboundTransport())