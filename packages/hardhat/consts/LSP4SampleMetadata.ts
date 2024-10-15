import { EncodeDataInput } from '@erc725/erc725.js/build/main/src/types/decodeData';

export const LSP4SampleJSON = {
  LSP4Metadata: {
    name: 'CHILL',
    description: 'introducing $chill',
    links: [
      {
        title: 'X',
        url: 'https://twitter.com/chillwhales',
      },
      {
        title: 'Common Ground',
        url: 'https://app.cg/c/bZe26yK9Uh/',
      },
      {
        title: 'Chillwhales',
        url: 'https://chillwhales.com/',
      },
    ],
    icon: [
      {
        width: 1614,
        height: 1614,
        url: 'ipfs://bafkreigiidxipuk3y5ep5jygsfcs5pdqtfjhkges7hlpimt3mqksznoeyu',
        verification: {
          method: 'keccak256(bytes)',
          data: '0x583d661aed68417e9fd1500f629c8d9cd6fadd9c31e948b2a6870b66c4f3bc03',
        },
      },
    ],
    images: [
      [
        {
          width: 480,
          height: 480,
          url: 'ipfs://bafybeihejctjezrjiid3ed4aw5dq3vxlwqfvigdu77ucpszgtmitlza5ty',
          verification: {
            method: 'keccak256(bytes)',
            data: '0xd1ee7a4fe6d0a05f2929a8e47a68f1828d0145d113567a432391becf2ba83cbf',
          },
        },
      ],
    ],
    backgroundImage: [
      {
        width: 1200,
        height: 400,
        url: 'ipfs://bafybeiglmtsb7k7bhchfxphazb6lqln45uaox3lqvx557dk5he5wqxqp2i',
        verification: {
          method: 'keccak256(bytes)',
          data: '0xd22f654e7dee3971ff32220b8c91ddd3427842392087a9bcae8d218915859eee',
        },
      },
    ],
    assets: [],
  },
};

export const lsp4SampleMetadata: EncodeDataInput[] = [
  {
    keyName: 'LSP4Metadata',
    value: {
      json: LSP4SampleJSON,
      url: 'ipfs://QmQTqheBLZFnQUxu5RDs8tA9JtkxfZqMBcmGd9sukXxwRm', // replace with example IPFS url
    },
  },
];
