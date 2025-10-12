export const svgrTypeDeclarationForNext = `
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
  const content: any
  export default content
}
`;

export const svgrTypeDeclarationForVite = `
/// <reference types="vite-plugin-svgr/client" />
`;
