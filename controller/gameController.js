APP.gameController = function($scope){

	$scope.screenWidth = $(window).width();
	$scope.screenHeight = $(window).height();
	$scope.backgroundPos1 = 0;
	$scope.backgroundPos2 = $(window).width();
	$scope.gameDistance = 0;
	$scope.gameStatus = 0;

	$scope.score = 0;
	$scope.coins = 0;
	//0 = GAME
	//1 = WIN
	//2 = LOSE

	$scope.updateBackground = function(){
		if($scope.backgroundPos2 <= 0){
			$scope.backgroundPos1 = 0;
			$scope.backgroundPos2 = $(window).width();
		}
		$scope.backgroundPos1 -= 1;
		$scope.backgroundPos2 -= 1;
	}

	$scope.updateCollision = function(){
		$scope.gameDistance += 1;
		// BULLET - MOB COLLISION
		var p = $scope.player;
		var b = $scope.player.bullets;
		var m = $scope.mobs.spawned;
		for (var i = 0; i < b.length; i++){
			for (var j = 0; j < m.length; j++){
				if ($scope.collide(b[i], m[j])){
					$scope.updateHealth(m[j], b[i].damage);
					b.splice(i, 1);
				}
				if(m[j].currentHealth == 0){
					$scope.score += m[j].score;
					m[j].imgsrc = "img/ea.gif?" + Math.floor(Math.random() * 999999);
					$scope.mobs.dead.push(m[j]);
					new Audio("sound/bdie.wav").play();
					m.splice(j, 1);
				} 
			}
		}
		// PLAYER - MOB COLLISION
		for (var j = 0; j < m.length; j++){
			if ($scope.collide(p, m[j])){
				$scope.updateHealth($scope.player, m[j].damage);
				m[j].imgsrc = "img/ea.gif?" + Math.floor(Math.random() * 999999);
				$scope.mobs.dead.push(m[j]);
				new Audio("sound/bdie.wav").play();
				m.splice(j, 1);
			} 
		}
	}

	$scope.collide = function(obj1, obj2){
		if(obj1 != null && obj2 != null){
			var obj1L = obj1.x + obj1.box.ox;
			var obj1T = obj1.y + obj1.box.oy;
			var obj1B = obj1.y + obj1.box.oy + obj1.box.y;
			var obj1R = obj1.x + obj1.box.ox + obj1.box.x;
			var obj2L = obj2.x + obj2.box.ox;
			var obj2T = obj2.y + obj2.box.oy;
			var obj2B = obj2.y + obj2.box.oy + obj2.box.y;
			var obj2R = obj2.x + obj2.box.ox + obj2.box.x;
			return !(obj2L > obj1R || 
				obj2R < obj1L || 
				obj2T > obj1B ||
				obj2B < obj1T);
		}
	}

	$scope.updateHealth = function(obj, damageTaken){
		var finalDamageTaken;
		if(obj.skin == null){
			var finalDamageTaken = damageTaken - (damageTaken * obj.defense) / 100;
		}
		else{
			var finalDamageTaken = damageTaken - (damageTaken * obj.skin.defense) / 100;
		}
		if(obj.currentHealth - finalDamageTaken > 0){
			obj.currentHealth -= finalDamageTaken;
		}
		else{
			obj.currentHealth = 0;
		}
	}

	$scope.createBox = function(sizeX, sizeY, offsetX, offsetY){
		var obj = {
			x : sizeX,
			y : sizeY,
			ox : offsetX,
			oy : offsetY,
		}
		return obj;
	}

	$scope.checkStatus = function(){
		if($scope.player.currentHealth <= 0){
			$scope.gameStatus = -1;
		}
		else if($scope.mobs.notSpawned.length == 0 && $scope.mobs.spawned.length == 0){
			$scope.gameStatus = 1;
		}
	}
}