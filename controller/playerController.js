APP.playerController = function($scope){
	$scope.updateSkin = function(){
		$scope.player.skin = $scope.skinData[$scope.currentSkinId];
		$scope.player.box = $scope.createBox($scope.skinData[$scope.currentSkinId].boxX, $scope.skinData[$scope.currentSkinId].boxY, 
				$scope.skinData[$scope.currentSkinId].boxOffsetX, $scope.skinData[$scope.currentSkinId].boxOffsetY);
	}

	$scope.moveRight = function(playerObj){
		if(playerObj.x < $scope.screenWidth - playerObj.box.x / 2){
			playerObj.x += playerObj.skin.speed_x;
		}
	}

	$scope.moveLeft = function(playerObj){
		if(playerObj.x > -playerObj.box.x / 2){
			playerObj.x -= playerObj.skin.speed_x;
		}	
	}

	$scope.moveUp = function(playerObj){
		if(playerObj.y > -playerObj.box.y / 2){
			playerObj.y -= playerObj.skin.speed_y;
		}
	}

	$scope.moveDown = function(playerObj){
		if(playerObj.y < $scope.screenHeight - playerObj.box.y){
			playerObj.y += playerObj.skin.speed_y;
		}	
	}

	$scope.shoot = function(playerObj){
		if(playerObj.fireCounter > playerObj.skin.fireRate && playerObj.currentMana - playerObj.skin.manaCost >= 0){
			var bullet = {
				x: playerObj.x + playerObj.skin.ox,
				y: playerObj.y + playerObj.skin.oy,
				box: $scope.createBox(50, 40, 0, 0),
				damage: playerObj.skin.bulletDamage,
			}
			playerObj.bullets.push(bullet);
			playerObj.currentMana -= playerObj.skin.manaCost;
			playerObj.fireCounter = 0;
			var sound = $scope.fireballSound.cloneNode();
			sound.play();
		}
	}

	$scope.updateMana = function(playerObj){
		playerObj.fireCounter += 1;
		if(playerObj.currentMana < playerObj.maxMana){
			playerObj.currentMana += playerObj.skin.manaRegen;
		}
	}
	
	$scope.updateBullets = function(playerObj){
		var b = playerObj.bullets;
		for (var i = 0; i < b.length; i++){
			b[i].x += playerObj.skin.bulletSpeed;
			if (b[i].x > $scope.screenWidth){
				b.splice(i, 1);
			} 
		}
	}
}