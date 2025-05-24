{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
  };

  outputs =
    {
      self,
      flake-utils,
      nixpkgs,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = (
          import nixpkgs {
            inherit system;
          }
        );

        petrohaus-shell = pkgs.mkShell {
          buildInputs = with pkgs; [
            flyctl
            nodejs
            php
            php.packages.composer
          ];

          shellHook = ''
            ./bin/setup-hooks.sh
          '';
        };
      in
      {
        # --* development shells *--
        devShells.default = petrohaus-shell;

        # --* formatter *--
        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
