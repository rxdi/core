export const IPFS_PROVIDERS = <{name: IPFS_PROVIDERS; link: string}[]>[
    {
        name: 'cloudflare',
        link: 'https://cloudflare-ipfs.com/ipfs/'
    },
    {
        name: 'main-ipfs-node',
        link: 'https://ipfs.io/ipfs/'
    }
];


export type IPFS_PROVIDERS = 'cloudflare' | 'main-ipfs-node';