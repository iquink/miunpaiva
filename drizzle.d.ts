declare module "*.sql" {
  const content: {
    default: {
      statements: string[];
    };
  };
  export default content;
}
