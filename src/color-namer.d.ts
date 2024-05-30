declare module 'color-namer' {
    interface Color {
      name: string;
      hex: string;
    }
  
    interface NamedColors {
      basic: Color[];
      hex: Color[];
      html: Color[];
      ntc: Color[];
      pantone: Color[];
    }
  
    function namer(hex: string): NamedColors;
  
    export = namer;
  }
  