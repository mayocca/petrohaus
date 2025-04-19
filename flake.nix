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
        php = pkgs.php.buildEnv {
          extensions = { enabled, all }: enabled ++ (with all; [ swoole ]);
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            php
            php.packages.composer
          ];
        };

        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
