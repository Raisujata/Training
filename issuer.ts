import { AskarModule } from "@credo-ts/askar";
import { Agent } from "@credo-ts/core";
import { AutoAcceptCredential, BasicMessagesModule, ConnectionsModule, CredentialsModule, getDefaultDidcommModules, HttpOutboundTransport, JsonLdCredentialFormatService, V2CredentialProtocol } from "@credo-ts/didcomm";
import { agentDependencies, HttpInboundTransport } from "@credo-ts/node";
import { askar } from "@openwallet-foundation/askar-nodejs";
import path from "path";

export const issuer = new Agent({
    config: {
        label: "TTPL",
        walletConfig: {
            id: "ttpl-wallet",
            key: "TTPL123",
        },
    },
    modules: {
        ...getDefaultDidcommModules({
            endpoints: ['http://localhost:9001/didcomm'],
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
        askar: new AskarModule({     // This is the module that provides the wallet functionality
            askar,
        })
    },
    dependencies: agentDependencies
})

issuer.modules.didcomm.registerInboundTransport(new HttpInboundTransport({  // This is the module that provides the inbound transport functionality
    port: 9001,
    path: '/didcomm',

}))
issuer.modules.didcomm.registerOutboundTransport(new HttpOutboundTransport()) // This is the module that provides the outbound transport functionality