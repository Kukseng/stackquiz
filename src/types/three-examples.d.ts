declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Loader } from 'three'
  import { GLTF } from 'three-stdlib'
  export class GLTFLoader extends Loader {
    load(url: string, onLoad: (gltf: any) => void, onProgress?: (evt: ProgressEvent) => void, onError?: (err: ErrorEvent) => void): void
    parse(data: ArrayBuffer | string, path: string, onLoad: (gltf: any) => void, onError?: (err: ErrorEvent) => void): void
  }
  export default GLTFLoader
}
