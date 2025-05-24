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

        petrohaus-php = pkgs.php.buildEnv {
          extensions =
            { enabled, all }:
            enabled
            ++ (with all; [
              pcntl
              swoole
            ]);
        };

        petrohaus-shell = pkgs.mkShell {
          buildInputs = with pkgs; [
            flyctl
            nodejs
            petrohaus-php
            petrohaus-php.packages.composer
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
